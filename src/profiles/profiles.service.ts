import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(@InjectRepository(Profile) private readonly profileRepository: Repository<Profile>) {}
  async create(userId: number, createProfileDto: CreateProfileDto) {
    const { profileName } = createProfileDto;
    const profileRecord = this.profileRepository.create({ profileName, user: { id: userId } });
    await this.profileRepository.save(profileRecord);
    return { id: profileRecord.id, profileName: profileRecord.profileName };
  }

  findAll(userId: number) {
    const profiles = this.profileRepository.find({ where: { user: { id: userId } } });
    return profiles;
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOneBy({ id });
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const { profileName } = updateProfileDto;
    const profileRecord = await this.findOne(id);
    profileRecord.profileName = profileName;
    await this.profileRepository.save(profileRecord);
    return { id: profileRecord.id, profileName: profileRecord.profileName };
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    this.profileRepository.remove(profile);
  }
}
