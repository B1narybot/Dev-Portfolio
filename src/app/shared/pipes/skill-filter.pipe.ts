import { Pipe, PipeTransform } from '@angular/core';
import { SkillNode } from '../data/neural-skills.data';

@Pipe({
  name: 'filter',
  standalone: true
})
export class SkillFilterPipe implements PipeTransform {
  transform(skills: SkillNode[], skillId: string): SkillNode[] {
    if (!skills || !skillId) return [];
    return skills.filter(s => s.id === skillId);
  }
}
