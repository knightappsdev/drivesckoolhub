'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Filter, X } from 'lucide-react';
import { getFilterOptions } from '@/lib/data/instructors';

interface InstructorFilters {
  location: string;
  transmission: string;
  nationality: string;
  religion: string;
  ethnicity: string;
  gender: string;
}

interface InstructorFiltersProps {
  onFiltersChange: (filters: InstructorFilters) => void;
  filters: InstructorFilters;
}

const majorUKCities = [
  { name: 'London', region: 'Greater London' },
  { name: 'Birmingham', region: 'West Midlands' },
  { name: 'Manchester', region: 'Greater Manchester' },
  { name: 'Liverpool', region: 'Merseyside' },
  { name: 'Leeds', region: 'West Yorkshire' },
  { name: 'Sheffield', region: 'South Yorkshire' },
  { name: 'Bristol', region: 'South West' },
  { name: 'Newcastle', region: 'Tyne and Wear' },
  { name: 'Nottingham', region: 'Nottinghamshire' },
  { name: 'Leicester', region: 'Leicestershire' },
  { name: 'Edinburgh', region: 'Scotland' },
  { name: 'Glasgow', region: 'Scotland' },
  { name: 'Cardiff', region: 'Wales' },
  { name: 'Belfast', region: 'Northern Ireland' },
  { name: 'Brighton', region: 'East Sussex' },
  { name: 'Oxford', region: 'Oxfordshire' },
  { name: 'Cambridge', region: 'Cambridgeshire' },
  { name: 'York', region: 'North Yorkshire' },
  { name: 'Bath', region: 'Somerset' },
  { name: 'Canterbury', region: 'Kent' }
];

export default function InstructorFilters({ onFiltersChange, filters }: InstructorFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const filterOptions = getFilterOptions();
  
  const filteredCities = majorUKCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateFilter = (key: keyof InstructorFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      location: '',
      transmission: '',
      nationality: '',
      religion: '',
      ethnicity: '',
      gender: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Find Your Perfect Instructor
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-destructive hover:text-destructive/80"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Search */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by city or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="pl-10"
            />
          </div>

          {/* Selected Location Display */}
          {filters.location && (
            <div className="p-3 bg-primary/10 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">Selected: {filters.location}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter('location', '')}
                className="text-primary hover:text-primary/80"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* City Grid */}
          {(!searchTerm || isExpanded) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(searchTerm ? filteredCities : majorUKCities.slice(0, 12)).map((city) => (
                <Button
                  key={city.name}
                  variant={filters.location === city.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('location', city.name)}
                  className="justify-start p-3 h-auto text-left hover:bg-primary/10"
                >
                  <div>
                    <div className="font-medium text-xs">{city.name}</div>
                    <div className="text-xs text-muted-foreground">{city.region}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Transmission Type */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Transmission Type</h4>
          <div className="grid grid-cols-2 gap-2">
            {['Manual', 'Automatic'].map((type) => (
              <Button
                key={type}
                variant={filters.transmission === type.toLowerCase() ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter('transmission', type.toLowerCase())}
                className="justify-center"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="w-full justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="space-y-4 border-t pt-4">
            {/* Gender Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Gender Preference</h4>
              <div className="grid grid-cols-3 gap-2">
                {filterOptions.genders.map((gender) => (
                  <Button
                    key={gender}
                    variant={filters.gender === gender ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter('gender', gender)}
                    className="justify-center text-xs"
                  >
                    {gender}
                  </Button>
                ))}
              </div>
            </div>

            {/* Nationality Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Nationality</h4>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {filterOptions.nationalities.map((nationality) => (
                  <Button
                    key={nationality}
                    variant={filters.nationality === nationality ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter('nationality', nationality)}
                    className="justify-start text-xs h-8"
                  >
                    {nationality}
                  </Button>
                ))}
              </div>
            </div>

            {/* Religion Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Religion</h4>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.religions.map((religion) => (
                  <Button
                    key={religion}
                    variant={filters.religion === religion ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter('religion', religion)}
                    className="justify-start text-xs h-8"
                  >
                    {religion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Ethnicity Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Ethnicity</h4>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {filterOptions.ethnicities.map((ethnicity) => (
                  <Button
                    key={ethnicity}
                    variant={filters.ethnicity === ethnicity ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter('ethnicity', ethnicity)}
                    className="justify-start text-xs h-8"
                  >
                    {ethnicity}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Count */}
        {hasActiveFilters && (
          <div className="text-center text-sm text-muted-foreground">
            {Object.values(filters).filter(v => v !== '').length} filter(s) active
          </div>
        )}
      </CardContent>
    </Card>
  );
}