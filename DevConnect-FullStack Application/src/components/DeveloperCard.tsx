import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Briefcase, Edit, Trash2 } from 'lucide-react';
import { Developer } from '@/types/developer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DeleteModal } from '@/components/DeleteModal';
import { useDevelopers } from '@/contexts/DeveloperContext';
import { toast } from 'sonner';

interface DeveloperCardProps {
  developer: Developer;
}

// Get initials from name (first two letters of first and last name)
function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

// Get role badge color
function getRoleBadgeStyles(role: Developer['role']) {
  switch (role) {
    case 'Frontend':
      return 'bg-primary/10 text-primary border-primary/30';
    case 'Backend':
      return 'bg-role-backend/10 text-role-backend border-role-backend/30';
    case 'Full-Stack':
      return 'bg-role-fullstack/10 text-role-fullstack border-role-fullstack/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

// Get avatar background color
function getAvatarColor(role: Developer['role']) {
  switch (role) {
    case 'Frontend':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Backend':
      return 'bg-role-backend/10 text-role-backend border-role-backend/20';
    case 'Full-Stack':
      return 'bg-role-fullstack/10 text-role-fullstack border-role-fullstack/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  const navigate = useNavigate();
  const { deleteDeveloper } = useDevelopers();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formattedDate = new Date(developer.joiningDate).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const handleDelete = () => {
    deleteDeveloper(developer.id);
    toast.success('Developer deleted successfully');
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300">
        {/* Header: Avatar + Name + Role */}
        <Link to={`/developer/${developer.id}`} className="block">
          <div className="flex items-start gap-4 mb-4">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold shrink-0 border-2",
              getAvatarColor(developer.role)
            )}>
              {getInitials(developer.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                {developer.name}
              </h3>
              <span className={cn(
                "inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border mt-1",
                getRoleBadgeStyles(developer.role)
              )}>
                {developer.role}
              </span>
            </div>
          </div>
        </Link>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {developer.techStack.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium border border-border"
            >
              {tech}
            </span>
          ))}
          {developer.techStack.length > 4 && (
            <span className="px-2.5 py-1 bg-secondary text-muted-foreground text-xs rounded-md">
              +{developer.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Experience + Joining Date */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            <span>{developer.experience} years</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Joined {formattedDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/developer/edit/${developer.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        developerName={developer.name}
      />
    </>
  );
}
