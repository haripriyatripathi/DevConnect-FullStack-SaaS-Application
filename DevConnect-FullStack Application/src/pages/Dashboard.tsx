import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, ChevronLeft, ChevronRight, UserPlus, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeveloperCard } from '@/components/DeveloperCard';
import { useDevelopers } from '@/contexts/DeveloperContext';

const ITEMS_PER_PAGE = 6;

const Dashboard = () => {
  const { developers } = useDevelopers();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort developers
  const filteredDevelopers = useMemo(() => {
    let result = developers.filter(dev => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Role filter
      const matchesRole = roleFilter === 'all' || dev.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    // Sort
    result = [...result].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
      } else if (sortOrder === 'experience-high') {
        return b.experience - a.experience;
      } else if (sortOrder === 'experience-low') {
        return a.experience - b.experience;
      }
      return 0;
    });

    return result;
  }, [developers, searchQuery, roleFilter, sortOrder]);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredDevelopers.length / ITEMS_PER_PAGE);
  const paginatedDevelopers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDevelopers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDevelopers, currentPage]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Developer Directory</h1>
          <p className="text-muted-foreground">{filteredDevelopers.length} developers in your network</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/developer/add" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Developer
          </Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or technology..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        <div className="flex gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px] bg-card">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Full-Stack">Full-Stack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[150px] bg-card">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="experience-high">Experience (High)</SelectItem>
                <SelectItem value="experience-low">Experience (Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Developer Grid */}
      {paginatedDevelopers.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {paginatedDevelopers.map((dev, index) => (
            <div
              key={dev.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <DeveloperCard developer={dev} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No developers found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                className="w-9"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
