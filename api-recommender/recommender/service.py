import re
import string
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
import random
from typing import List, Optional, Dict, Any
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RecommenderEngine:
    def __init__(self):
        self.df = None
        self.vectorizer = None
        self.X = None
        self.feature_names = None
        self.text_stopwords = None
        self.punct_table = None
        self._initialize_text_processing()
    
    def _initialize_text_processing(self):
        """Initialize text processing components"""
        try:
            # Zorg dat stopwords beschikbaar zijn
            try:
                dutch_stopwords = set(stopwords.words("dutch"))
            except LookupError:
                nltk.download("stopwords")
                dutch_stopwords = set(stopwords.words("dutch"))

            # Optioneel: extra domein-specifieke "ruiswoorden"
            extra_noise = {
                "bij", "voor", "met", "door", "zonder", "over",
                "doelgroep", "werk", "werken", "proces", "praktijk",
                "ontwikkeling", "ontwikkelen", "gaan",
                "leren", "school", "module", "modules", "thema",
                "student", "opleiding", "kun" , "vanuit",
                "eigen", "zelf", "samen", "samenwerken",
                "jaar", "week", "periode", "naasten", "daarnaast",
                "minor", "studenten", "programma", "keuzemodule",
                "casus", "casussen", "cases", "vraagstukken",
                "stage", "stageschool", "kennismakingsstage",
                "kennis", "vaardigheid", "vaardigheden", "ervaring", "ervaringen",
                "lessen", "onderwerpen", "theorie", "praktijk", "praktische", "inhoudelijke",
                "mee", "doe", "vinden", "vind", "kies", "openstaan",
                "belangrijk", "positief", "mogelijkheden","mogelijkheid",
                "impact", "betekenis", "betekent", "betekenen",
                "you", "your", "are", "will", "what", "then", "like", "choose",
                "interested", "experiencing", "hbo", "and", "the", "persoonlijke",
                "learning", "denken", "maken", "business", "verdieping", "emgeving",
                "bouwen", "thinking", "branding", "maken", "urban", "veiligheid",
                "nieuwe", "test", "gebouwde", "concept", "project", "omgeving", "actuele", "acute",
                "yellow", "belt", "serious", "hrm", "mensen", "snel", "binnen", "materialen", 
                "active", "druk", "context", "leven", "complexe" , "brede", "for", "jouw", "manieren"
            }

            self.text_stopwords = dutch_stopwords | extra_noise
            self.punct_table = str.maketrans("", "", string.punctuation + "''""´`")
            
        except Exception as e:
            logger.error(f"Error initializing text processing: {e}")
            # Fallback
            self.text_stopwords = set()
            self.punct_table = str.maketrans("", "", string.punctuation)

    def clean_text_for_matching(self, text: str) -> str:
        """
        Maakt tekst klaar voor matching:
        - lowercase
        - verwijder punctuation
        - verwijder cijfers
        - verwijder NL stopwoorden (+ extra noise)
        """
        if not isinstance(text, str):
            return ""
        
        # lowercasing
        text = text.lower()
        
        # punctuation verwijderen
        text = text.translate(self.punct_table)
        
        # cijfers eruit
        text = re.sub(r"\d+", " ", text)
        
        # meerdere spaties
        text = re.sub(r"\s+", " ", text).strip()
        
        # stopwoorden filteren
        tokens = [
            tok for tok in text.split()
            if tok not in self.text_stopwords and len(tok) > 2
        ]
        
        return " ".join(tokens)

    def load_data(self, csv_path: str):
        """Load and preprocess the course data"""
        try:
            self.df = pd.read_csv(csv_path)
            logger.info(f"Loaded {len(self.df)} courses from {csv_path}")
            
            # Build text columns
            text_columns = ["name", "shortdescription"]
            
            def build_raw_text(row: pd.Series) -> str:
                parts = []
                for col in text_columns:
                    if col in row and isinstance(row[col], str):
                        parts.append(row[col])
                return " ".join(parts)

            self.df["raw_text"] = self.df.apply(build_raw_text, axis=1)
            self.df["clean_text"] = self.df["raw_text"].apply(self.clean_text_for_matching)
            
            # Fit vectorizer
            self.vectorizer = TfidfVectorizer(
                ngram_range=(1, 2),
                max_df=0.8,      # woorden die in >80% van de modules zitten eruit
                min_df=2,        # woorden die maar 1x voorkomen eruit
            )
            
            self.X = self.vectorizer.fit_transform(self.df["clean_text"])
            self.feature_names = self.vectorizer.get_feature_names_out()
            
            logger.info(f"Vectorizer fitted. Shape: {self.X.shape}, Features: {len(self.feature_names)}")
            
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            raise

    def _format_term_list(self, terms: List[str]) -> str:
        """
        Maak een nette NL opsomming:
        - 'A'
        - 'A' en 'B'
        - 'A', 'B' en 'C'
        """
        if not terms:
            return ""
        if len(terms) == 1:
            return f"'{terms[0]}'"
        if len(terms) == 2:
            return f"'{terms[0]}' en '{terms[1]}'"
        # 3 of meer
        quoted = [f"'{t}'" for t in terms]
        hoofd = ", ".join(quoted[:-1])
        laatste = quoted[-1]
        return f"{hoofd} en {laatste}"

    def build_reason(self, match_terms: List[str], module_name: Optional[str] = None, score: Optional[float] = None) -> str:
        """
        Genereer een korte NL tekst waarom de module past.
        """
        terms_str = self._format_term_list(match_terms)

        # score -> indicatie hoe sterk de match is
        if score is None:
            kwalificatie = "goed"
        elif score >= 0.8:
            kwalificatie = "erg goed"
        elif score >= 0.6:
            kwalificatie = "goed"
        else:
            kwalificatie = "redelijk"

        # Geen specifieke termen: algemene uitleg
        if not match_terms:
            templates = [
                "Deze module sluit {kwalificatie} aan bij je interesses op basis van tekstuele overeenkomsten.",
                "Op basis van de overeenkomst tussen jouw profiel en de modulebeschrijving lijkt deze module {kwalificatie} bij je te passen.",
                "Deze module lijkt inhoudelijk {kwalificatie} aan te sluiten bij wat je interessant vindt."
            ]
        else:
            # Met match_terms
            if module_name:
                templates = [
                    "Je interesse in {terms} komt duidelijk terug in '{module}', waardoor deze module {kwalificatie} bij je aansluit.",
                    "Omdat {terms} centraal staan in '{module}', past deze module {kwalificatie} bij jouw interesses.",
                    "In '{module}' komen {terms} aan bod, wat goed aansluit bij jouw interesses."
                ]
            else:
                templates = [
                    "Deze module sluit {kwalificatie} aan bij je interesses in {terms}.",
                    "Omdat {terms} in deze module aan bod komen, lijkt deze {kwalificatie} bij je te passen.",
                    "Je interesse in {terms} komt terug in de inhoud van deze module, waardoor deze goed bij je past."
                ]

        template = random.choice(templates)
        return template.format(
            kwalificatie=kwalificatie,
            terms=terms_str,
            module=module_name if module_name else ""
        )

    def extract_match_terms(self, student_vec, module_vec, max_terms: int = 8) -> List[str]:
        """
        Bepaal welke termen (woorden) zowel in de studentvector
        als in de modulevector voorkomen.
        """
        # indices waar de vector niet 0 is
        student_idx = set(student_vec.nonzero()[1])
        module_idx = set(module_vec.nonzero()[1])

        shared_idx = sorted(student_idx & module_idx)
        terms = [self.feature_names[i] for i in shared_idx]

        return terms[:max_terms]

    def recommend_modules(self, student_profile: str, top_n: int = 5, 
                         studycredit: Optional[int] = None, 
                         level: Optional[str] = None, 
                         location: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Geeft top N modules voor een studentprofiel
        """
        if self.df is None or self.vectorizer is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        
        try:
            # Start met volledige df
            filtered_df = self.df.copy()

            # Filter op studiepunten, niveau, locatie
            if studycredit is not None:
                filtered_df = filtered_df[filtered_df["studycredit"] == studycredit]

            if level is not None:
                filtered_df = filtered_df[filtered_df["level"].isin([level])]

            if location is not None:
                filtered_df = filtered_df[
                    filtered_df["location"].str.contains(location, case=False, na=False)
                ]

            # Niks over? Return lege lijst
            if filtered_df.empty:
                return []

            # Studentprofiel vectoriseren
            clean_profile = self.clean_text_for_matching(student_profile)
            student_vec = self.vectorizer.transform([clean_profile])

            # Bijbehorende rijen uit X pakken
            row_indices = filtered_df.index.to_numpy()
            X_filtered = self.X[row_indices]

            # Cosine similarity
            sims = cosine_similarity(student_vec, X_filtered).flatten()

            # In kopie wegschrijven
            filtered_df = filtered_df.copy()
            filtered_df["similarity_raw"] = sims

            # Normaliseren naar 0–1 binnen deze selectie
            max_sim = sims.max()
            if max_sim > 0:
                norm_sims = sims / max_sim
            else:
                norm_sims = sims  # alles 0

            filtered_df["similarity"] = norm_sims

            # Sorteren en top N pakken
            top = filtered_df.sort_values("similarity", ascending=False).head(top_n)

            # Build recommendations list
            recommendations = []
            
            for idx in top.index:
                # positie van deze rij binnen X_filtered
                pos = np.where(row_indices == idx)[0][0]
                module_vec = X_filtered[pos]

                terms = self.extract_match_terms(student_vec, module_vec)
                reason = self.build_reason(
                    terms,
                    module_name=top.at[idx, "name"],
                    score=top.at[idx, "similarity"]
                )
                
                recommendation = {
                    "id": int(top.at[idx, "id"]),
                    "name": str(top.at[idx, "name"]),
                    "description": str(top.at[idx, "shortdescription"]) if pd.notna(top.at[idx, "shortdescription"]) else "",
                    "similarity_score": float(top.at[idx, "similarity"]),
                    "similarity_raw": float(top.at[idx, "similarity_raw"]),
                    "location": str(top.at[idx, "location"]) if pd.notna(top.at[idx, "location"]) else "",
                    "studycredit": int(top.at[idx, "studycredit"]) if pd.notna(top.at[idx, "studycredit"]) else 0,
                    "level": str(top.at[idx, "level"]) if pd.notna(top.at[idx, "level"]) else "",
                    "module_tags": str(top.at[idx, "module_tags"]) if pd.notna(top.at[idx, "module_tags"]) else "",
                    "match_terms": terms,
                    "reason": reason
                }
                recommendations.append(recommendation)

            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            return []

# Global instance
recommender_engine = RecommenderEngine()

def initialize_recommender(csv_path: str):
    """Initialize the recommender engine with CSV data"""
    recommender_engine.load_data(csv_path)

def get_module_recommendations(student_profile: str, **kwargs) -> List[Dict[str, Any]]:
    """Get module recommendations for a student profile"""
    return recommender_engine.recommend_modules(student_profile, **kwargs)