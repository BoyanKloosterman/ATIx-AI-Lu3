import { environment } from '../../../shared/environments/environment';
import type { UpdateProfileResponse, CreateProfileDto, ProfileApi } from '../types/profile.types';

export class ProfileService {
    async createProfile(createProfileData: CreateProfileDto): Promise<UpdateProfileResponse> {
        const newUser : ProfileApi = {
            studyProgram: createProfileData.opleiding,
            studyLocation: createProfileData.studielocatie,
            studyCredits: createProfileData.studiepunten,
            yearOfStudy: Number(createProfileData.leerjaar),
            skills: createProfileData.skills,
            interests: createProfileData.interests,
        }
        console.log("Creating profile with data:", newUser);
        const response = await fetch(`${environment.apiUrl}/user/updateProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            let errorText = 'Create profile failed';
            try {
                const error = await response.json();
                errorText = error.message || errorText;
            } catch (_) {
                // ignore JSON parse errors
            }
            throw new Error(errorText);
        }

        return response.json();
    }
}

export const profileService = new ProfileService();
