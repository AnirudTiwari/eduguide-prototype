import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import OpportunityCard from '../components/OpportunityCard';
import DetailModal from '../components/DetailModal';
import FilterBar from '../components/FilterBar';

/**
 * Explore Page Component
 * Allows students to browse, filter, search, bookmark, and inspect
 * sample Colleges, Entrance Exams, and Scholarships.
 */
export default function Explore() {
  const {
    colleges,
    exams,
    scholarships,
    savedIds,
    toggleSaved,
    isSaved,
    tasks,
    addTask,
  } = useApp();

  // Active Category Tab: 'colleges' | 'exams' | 'scholarships'
  const [activeTab, setActiveTab] = useState('colleges');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown filter selections
  const [filters, setFilters] = useState({
    course: 'ALL',
    location: 'ALL',
    level: 'ALL',
  });

  // Saved only toggle state
  const [savedOnly, setSavedOnly] = useState(false);

  // Selected item for the Detail Modal view
  const [selectedItem, setSelectedItem] = useState(null);

  // Reset filters when switching tabs
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchQuery('');
    setFilters({ course: 'ALL', location: 'ALL', level: 'ALL' });
    setSavedOnly(false);
  };

  // Handler for individual dropdown changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Clear all active filters and search
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({ course: 'ALL', location: 'ALL', level: 'ALL' });
    setSavedOnly(false);
  };

  // Compute active dataset based on the current tab
  const activeDataset = useMemo(() => {
    if (activeTab === 'colleges') return colleges;
    if (activeTab === 'exams') return exams;
    return scholarships;
  }, [activeTab, colleges, exams, scholarships]);

  // Derive unique options for dropdown filters from the dataset
  const filterOptions = useMemo(() => {
    if (activeTab === 'colleges') {
      const courses = Array.from(new Set(colleges.map((c) => c.course))).sort();
      const locations = Array.from(
        new Set(colleges.map((c) => `${c.state}`))
      ).sort();
      const levels = Array.from(new Set(colleges.map((c) => c.level))).sort();
      return { courses, locations, levels };
    }

    if (activeTab === 'exams') {
      const levels = Array.from(new Set(exams.map((e) => e.level))).sort();
      return { courses: [], locations: [], levels };
    }

    const levels = Array.from(new Set(scholarships.map((s) => s.level))).sort();
    return { courses: [], locations: [], levels };
  }, [activeTab, colleges, exams, scholarships]);

  // Apply search, dropdown filters, and savedOnly condition
  const filteredItems = useMemo(() => {
    return activeDataset.filter((item) => {
      // 1. Text search on name, blurb, and course
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesBlurb = item.blurb
          ? item.blurb.toLowerCase().includes(query)
          : false;
        const matchesCourse = item.course
          ? item.course.toLowerCase().includes(query)
          : false;
        const matchesLocation =
          (item.city && item.city.toLowerCase().includes(query)) ||
          (item.state && item.state.toLowerCase().includes(query));

        if (!matchesName && !matchesBlurb && !matchesCourse && !matchesLocation) {
          return false;
        }
      }

      // 2. Saved only toggle
      if (savedOnly && !savedIds.includes(item.id)) {
        return false;
      }

      // 3. Dropdown filters
      if (activeTab === 'colleges') {
        if (filters.course !== 'ALL' && item.course !== filters.course) {
          return false;
        }
        if (
          filters.location !== 'ALL' &&
          item.state !== filters.location &&
          !item.city.includes(filters.location)
        ) {
          return false;
        }
        if (filters.level !== 'ALL' && item.level !== filters.level) {
          return false;
        }
      } else if (activeTab === 'exams' || activeTab === 'scholarships') {
        if (filters.level !== 'ALL' && item.level !== filters.level) {
          return false;
        }
      }

      return true;
    });
  }, [activeDataset, searchQuery, savedOnly, savedIds, activeTab, filters]);

  // Check if any filter or search query is currently active
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    savedOnly ||
    filters.course !== 'ALL' ||
    filters.location !== 'ALL' ||
    filters.level !== 'ALL';

  // Category counts
  const tabCounts = {
    colleges: colleges.length,
    exams: exams.length,
    scholarships: scholarships.length,
  };

  const currentTabLabel =
    activeTab === 'colleges'
      ? 'colleges'
      : activeTab === 'exams'
      ? 'entrance exams'
      : 'scholarships';

  const resultCountText = `Showing ${filteredItems.length} of ${activeDataset.length} ${currentTabLabel}`;

  return (
    <div className="container explore-page">
      {/* Page Header */}
      <header className="page-header explore-header">
        <div className="explore-header-text">
          <div className="breadcrumb-nav">
            <Link to="/" className="breadcrumb-link">
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="page-title">Explore Opportunities</h1>
          <p className="page-description">
            Discover colleges, upcoming entrance exams, and eligible scholarships in one place.
          </p>
        </div>
        <span className="tag-sample" style={{ alignSelf: 'flex-start' }}>
          Illustrative details
        </span>
      </header>

      {/* Filter and Tab Navigation Controls */}
      <FilterBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabCounts={tabCounts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
        savedOnly={savedOnly}
        onToggleSavedOnly={setSavedOnly}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        resultCountText={resultCountText}
      />

      {/* Main Opportunities Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="empty-state explore-empty-state">
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
          <h3>No opportunities match your filter</h3>
          <p>
            We couldn't find any {currentTabLabel} matching your current search or filters.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="explore-grid" role="region" aria-label="Opportunities list">
          {filteredItems.map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              type={activeTab}
              isSaved={isSaved(item.id)}
              onToggleSave={toggleSaved}
              onClickCard={() => setSelectedItem(item)}
            />
          ))}
        </div>
      )}

      {/* Detail Slide-over / Modal */}
      <DetailModal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        type={activeTab}
        isSaved={selectedItem ? isSaved(selectedItem.id) : false}
        onToggleSave={toggleSaved}
        onAddTask={addTask}
        tasks={tasks}
      />
    </div>
  );
}
