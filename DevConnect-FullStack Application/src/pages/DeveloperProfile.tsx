import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Briefcase, Code2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteModal } from '@/components/DeleteModal';
import { useDevelopers } from '@/contexts/DeveloperContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function getAvatarColor(role: string) {
  switch (role) {
    case 'Frontend': return 'bg-primary';
    case 'Backend': return 'bg-role-backend';
    case 'Full-Stack': return 'bg-role-fullstack';
    default: return 'bg-muted-foreground';
  }
}

function getRoleBadgeStyles(role: string) {
  switch (role) {
    case 'Frontend': return 'bg-primary/10 text-primary border-primary/20';
    case 'Backend': return 'bg-role-backend/10 text-role-backend border-role-backend/20';
    case 'Full-Stack': return 'bg-role-fullstack/10 text-role-fullstack border-role-fullstack/20';
    default: return 'bg-muted text-muted-foreground';
  }
}

const DeveloperProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDeveloper, deleteDeveloper } = useDevelopers();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const developer = getDeveloper(id!);

  if (!developer) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-foreground mb-2">Developer not found</h2>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteDeveloper(developer.id);
    toast.success('Developer deleted successfully');
    navigate('/dashboard');
  };

  const formattedDate = new Date(developer.joiningDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className={cn(
              "w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg",
              getAvatarColor(developer.role)
            )}>
              {developer.name.charAt(0).toUpperCase()}
            </div>

            {/* Name & Role */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">{developer.name}</h1>
              <span className={cn(
                "inline-block px-3 py-1 text-sm font-medium rounded-full border",
                getRoleBadgeStyles(developer.role)
              )}>
                {developer.role}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/developer/edit/${developer.id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Description */}
            {developer.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
                <p className="text-foreground">{developer.description}</p>
              </div>
            )}

            {/* Tech Stack */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <Code2 className="w-4 h-4" />
                <span>Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {developer.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-lg font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Experience */}
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <Briefcase className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-semibold text-foreground">{developer.experience} years</p>
              </div>
            </div>

            {/* Joining Date */}
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-semibold text-foreground">{formattedDate}</p>
              </div>
            </div>

            {/* Email */}
            {developer.email && (
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">{developer.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        developerName={developer.name}
      />
    </div>
  );
};

export default DeveloperProfile;
