'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
  selectedLocation?: string;
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

export default function LocationSearch({ onLocationSelect, selectedLocation }: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredCities = majorUKCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationClick = (cityName: string) => {
    onLocationSelect(cityName);
    setSearchTerm('');
    setIsExpanded(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Find Instructors Near You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
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

        {/* Selected Location */}
        {selectedLocation && (
          <div className="p-3 bg-primary/10 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">Selected: {selectedLocation}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLocationSelect('')}
              className="text-primary hover:text-primary/80"
            >
              Clear
            </Button>
          </div>
        )}

        {/* Popular Cities Grid */}
        {(!searchTerm || isExpanded) && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              {searchTerm ? 'Search Results' : 'Popular Cities'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {(searchTerm ? filteredCities : majorUKCities.slice(0, 12)).map((city) => (
                <Button
                  key={city.name}
                  variant={selectedLocation === city.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLocationClick(city.name)}
                  className="justify-start p-3 h-auto text-left hover:bg-primary/10"
                >
                  <div>
                    <div className="font-medium text-xs">{city.name}</div>
                    <div className="text-xs text-muted-foreground">{city.region}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            {!searchTerm && majorUKCities.length > 12 && (
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full mt-2"
              >
                {isExpanded ? 'Show Less' : `Show All ${majorUKCities.length} Cities`}
              </Button>
            )}
          </div>
        )}

        {/* No Results */}
        {searchTerm && filteredCities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No cities found matching "{searchTerm}"</p>
            <p className="text-sm">Try searching for a different city or region</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}