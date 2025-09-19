'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { PlusIcon, TrashIcon, EyeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface LayoutConfig {
  id: string;
  name: string;
  role: string;
  navigation: NavItem[];
  dashboard_widgets: Widget[];
  theme: ThemeConfig;
}

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  order: number;
  visible: boolean;
}

interface Widget {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  visible: boolean;
}

interface ThemeConfig {
  primary_color: string;
  sidebar_color: string;
  text_color: string;
  custom_css?: string;
}

const defaultNavItems = [
  { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
  { id: 'users', name: 'Users', href: '/dashboard/users', icon: 'UsersIcon' },
  { id: 'bookings', name: 'Bookings', href: '/dashboard/bookings', icon: 'CalendarIcon' },
  { id: 'payments', name: 'Payments', href: '/dashboard/payments', icon: 'CreditCardIcon' },
  { id: 'messages', name: 'Messages', href: '/dashboard/messages', icon: 'ChatBubbleLeftRightIcon' },
  { id: 'notifications', name: 'Notifications', href: '/dashboard/notifications', icon: 'BellIcon' },
  { id: 'analytics', name: 'Analytics', href: '/dashboard/analytics', icon: 'ChartBarIcon' },
  { id: 'settings', name: 'Settings', href: '/dashboard/settings', icon: 'CogIcon' }
];

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'student', label: 'Student' }
];

export default function LayoutManager() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [layouts, setLayouts] = useState<LayoutConfig[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<LayoutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const tabs = ['Layout Configuration', 'Theme Customization', 'Preview'];

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      // Mock data for now - in real app, this would fetch from API
      const mockLayouts: LayoutConfig[] = [
        {
          id: 'super_admin_default',
          name: 'Super Admin Default',
          role: 'super_admin',
          navigation: defaultNavItems.map((item, index) => ({
            ...item,
            order: index,
            visible: true
          })),
          dashboard_widgets: [
            {
              id: 'stats_overview',
              type: 'stats',
              title: 'System Overview',
              position: { x: 0, y: 0, w: 12, h: 4 },
              config: { metrics: ['users', 'bookings', 'revenue'] },
              visible: true
            }
          ],
          theme: {
            primary_color: '#3B82F6',
            sidebar_color: '#FFFFFF',
            text_color: '#1F2937'
          }
        },
        {
          id: 'student_default',
          name: 'Student Default',
          role: 'student',
          navigation: defaultNavItems.filter(item => 
            ['dashboard', 'bookings', 'payments', 'messages', 'notifications'].includes(item.id)
          ).map((item, index) => ({
            ...item,
            order: index,
            visible: true
          })),
          dashboard_widgets: [
            {
              id: 'upcoming_lessons',
              type: 'lessons',
              title: 'Upcoming Lessons',
              position: { x: 0, y: 0, w: 8, h: 6 },
              config: { limit: 5 },
              visible: true
            }
          ],
          theme: {
            primary_color: '#10B981',
            sidebar_color: '#F9FAFB',
            text_color: '#111827'
          }
        }
      ];
      
      setLayouts(mockLayouts);
      setSelectedLayout(mockLayouts[0]);
    } catch (error) {
      console.error('Error fetching layouts:', error);
      toast.error('Failed to load layouts');
    } finally {
      setLoading(false);
    }
  };

  const saveLayout = async () => {
    if (!selectedLayout) return;
    
    setSaving(true);
    try {
      // Mock save - in real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLayouts(prev => prev.map(layout => 
        layout.id === selectedLayout.id ? selectedLayout : layout
      ));
      
      toast.success('Layout saved successfully');
    } catch (error) {
      console.error('Error saving layout:', error);
      toast.error('Failed to save layout');
    } finally {
      setSaving(false);
    }
  };

  const addNavItem = () => {
    if (!selectedLayout) return;
    
    const newItem: NavItem = {
      id: `custom_${Date.now()}`,
      name: 'New Item',
      href: '/dashboard/new',
      icon: 'PlusIcon',
      order: selectedLayout.navigation.length,
      visible: true
    };

    setSelectedLayout({
      ...selectedLayout,
      navigation: [...selectedLayout.navigation, newItem]
    });
  };

  const updateNavItem = (id: string, updates: Partial<NavItem>) => {
    if (!selectedLayout) return;
    
    setSelectedLayout({
      ...selectedLayout,
      navigation: selectedLayout.navigation.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    });
  };

  const removeNavItem = (id: string) => {
    if (!selectedLayout) return;
    
    setSelectedLayout({
      ...selectedLayout,
      navigation: selectedLayout.navigation.filter(item => item.id !== id)
    });
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    if (!selectedLayout) return;
    
    setSelectedLayout({
      ...selectedLayout,
      theme: { ...selectedLayout.theme, ...updates }
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Layout Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Layout</h3>
          <button
            onClick={saveLayout}
            disabled={saving || !selectedLayout}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setSelectedLayout(layout)}
              className={`p-4 text-left border-2 rounded-lg transition-colors ${
                selectedLayout?.id === layout.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900">{layout.name}</h4>
              <p className="text-sm text-gray-600 capitalize">
                {layout.role.replace('_', ' ')} Role
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {layout.navigation.filter(n => n.visible).length} nav items, 
                {layout.dashboard_widgets.filter(w => w.visible).length} widgets
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedLayout && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 rounded-t-lg bg-gray-50 p-1 border-b">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${
                      selected
                        ? 'bg-white text-blue-700 shadow'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                    }`
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="p-6">
              {/* Layout Configuration */}
              <Tab.Panel className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Navigation Items</h4>
                    <button
                      onClick={addNavItem}
                      className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedLayout.navigation.map((item, index) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1 grid grid-cols-4 gap-4">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateNavItem(item.id, { name: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) => updateNavItem(item.id, { href: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Path"
                          />
                          <input
                            type="number"
                            value={item.order}
                            onChange={(e) => updateNavItem(item.id, { order: parseInt(e.target.value) })}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Order"
                          />
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.visible}
                              onChange={(e) => updateNavItem(item.id, { visible: e.target.checked })}
                              className="mr-2 rounded border-gray-300"
                            />
                            Visible
                          </label>
                        </div>
                        <button
                          onClick={() => removeNavItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>

              {/* Theme Customization */}
              <Tab.Panel className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900">Theme Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={selectedLayout.theme.primary_color}
                      onChange={(e) => updateTheme({ primary_color: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sidebar Color
                    </label>
                    <input
                      type="color"
                      value={selectedLayout.theme.sidebar_color}
                      onChange={(e) => updateTheme({ sidebar_color: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={selectedLayout.theme.text_color}
                      onChange={(e) => updateTheme({ text_color: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom CSS
                  </label>
                  <textarea
                    value={selectedLayout.theme.custom_css || ''}
                    onChange={(e) => updateTheme({ custom_css: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                    placeholder="/* Add custom CSS here */"
                  />
                </div>
              </Tab.Panel>

              {/* Preview */}
              <Tab.Panel>
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900">Layout Preview</h4>
                  
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <div className="flex h-96">
                      {/* Sidebar Preview */}
                      <div 
                        className="w-64 p-4 border-r"
                        style={{ backgroundColor: selectedLayout.theme.sidebar_color }}
                      >
                        <h3 className="font-bold text-lg mb-4" style={{ color: selectedLayout.theme.text_color }}>
                          DriveSchool Pro
                        </h3>
                        <nav className="space-y-2">
                          {selectedLayout.navigation
                            .filter(item => item.visible)
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                                style={{ color: selectedLayout.theme.text_color }}
                              >
                                <span className="w-5 h-5 mr-3 bg-gray-400 rounded"></span>
                                <span className="text-sm">{item.name}</span>
                              </div>
                            ))}
                        </nav>
                      </div>
                      
                      {/* Main Content Preview */}
                      <div className="flex-1 p-6">
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold" style={{ color: selectedLayout.theme.text_color }}>
                            Dashboard Preview
                          </h2>
                          <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-24 bg-white rounded-lg shadow-sm border flex items-center justify-center">
                                <span className="text-gray-500 text-sm">Widget {i}</span>
                              </div>
                            ))}
                          </div>
                          <div className="h-32 bg-white rounded-lg shadow-sm border flex items-center justify-center">
                            <span className="text-gray-500">Main Content Area</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Note:</strong> This is a simplified preview. Actual implementation may vary.</p>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </div>
  );
}