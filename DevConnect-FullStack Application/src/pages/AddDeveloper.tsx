import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const AddDeveloper = () => {
  const navigate = useNavigate();
  const { addDeveloper } = useDevelopers();
  const [formData, setFormData] = useState({
    name: '',
    role: '' as DeveloperRole | '',
    techStack: '',
    experience: '',
    description: '',
    joiningDate: new Date().toISOString().split('T')[0],
    email: '',
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
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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
      description: formData.description.trim() || undefined,
      joiningDate: formData.joiningDate,
      email: formData.email.trim() || undefined,
    });

    toast.success('Developer added successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Add Developer</h1>
            <p className="text-sm text-muted-foreground">Add a new developer to the directory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="developer@example.com"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
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

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years) *</Label>
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
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <Label htmlFor="techStack">Tech Stack *</Label>
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

          {/* Joining Date */}
          <div className="space-y-2">
            <Label htmlFor="joiningDate">Joining Date</Label>
            <Input
              id="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={e => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description about the developer..."
              rows={4}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">Save Developer</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeveloper;
