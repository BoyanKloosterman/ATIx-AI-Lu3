import { IsString, IsArray } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    studyProgram: string;
    @IsString()
    studyLocation: string;
    @IsString()
    studyCredits: string;
    @IsString()
    yearOfStudy: number;
    @IsArray()
    skills: string[];
    @IsArray()
    interests: string[];
}
