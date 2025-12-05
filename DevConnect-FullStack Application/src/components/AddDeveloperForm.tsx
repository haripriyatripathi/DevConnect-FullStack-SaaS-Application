import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDevelopers } from '@/contexts/DeveloperContext';
import { DeveloperRole } from '@/types/developer';
import { toast } from 'sonner';

export function AddDeveloperForm() {
  const { addDeveloper } = useDevelopers();
  const [formData, setFormData] = useState({
    name: '',
    role: '' as DeveloperRole | '',
    techStack: '',
    experience: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.techStack.trim()) newErrors.techStack = 'Tech stack is required';
    if (!formData.experience || Number(formData.experience) < 0) {
      newErrors.experience = 'Valid experience is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addDeveloper({
      name: formData.name.trim(),
      role: formData.role as DeveloperRole,
      techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
      experience: Number(formData.experience),
      joiningDate: new Date().toISOString().split('T')[0],
    });

    toast.success('Developer added successfully!');
    setFormData({ name: '', role: '', techStack: '', experience: '' });
    setErrors({});
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Add Developer</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={value => setFormData(prev => ({ ...prev, role: value as DeveloperRole }))}
          >
            <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Full-Stack">Full-Stack</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <Label htmlFor="techStack">Tech Stack</Label>
          <Input
            id="techStack"
            placeholder="React, TypeScript, Node.js"
            value={formData.techStack}
            onChange={e => setFormData(prev => ({ ...prev, techStack: e.target.value }))}
            className={errors.techStack ? 'border-destructive' : ''}
          />
          <p className="text-xs text-muted-foreground">Separate technologies with commas</p>
          {errors.techStack && <p className="text-xs text-destructive">{errors.techStack}</p>}
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience">Experience (years)</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            placeholder="0"
            value={formData.experience}
            onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            className={errors.experience ? 'border-destructive' : ''}
          />
          {errors.experience && <p className="text-xs text-destructive">{errors.experience}</p>}
        </div>

        <Button type="submit" className="w-full">
          Add Developer
        </Button>
      </form>
    </div>
  );
}
