/**
 * FilterBar Component
 * Provides tab navigation (Colleges | Exams | Scholarships),
 * live search box, dynamic dropdown filters, saved-only toggle, and clear filters.
 */
export default function FilterBar({
  activeTab,
  onTabChange,
  tabCounts,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  filterOptions,
  savedOnly,
  onToggleSavedOnly,
  onClearFilters,
  hasActiveFilters,
  resultCountText,
}) {
  return (
    <div className="filter-bar-container">
      {/* 1. Category Tabs with Counts */}
      <div className="tabs-header" role="tablist" aria-label="Explore Categories">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'colleges'}
          className={`tab-btn ${activeTab === 'colleges' ? 'active' : ''}`}
          onClick={() => onTabChange('colleges')}
        >
          <span>🎓 Colleges</span>
          <span className="tab-count-badge">{tabCounts.colleges}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'exams'}
          className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => onTabChange('exams')}
        >
          <span>📝 Exams</span>
          <span className="tab-count-badge">{tabCounts.exams}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'scholarships'}
          className={`tab-btn ${activeTab === 'scholarships' ? 'active' : ''}`}
          onClick={() => onTabChange('scholarships')}
        >
          <span>💰 Scholarships</span>
          <span className="tab-count-badge">{tabCounts.scholarships}</span>
        </button>
      </div>

      {/* 2. Search & Controls Bar */}
      <div className="controls-card">
        <div className="controls-row-top">
          {/* Live Search Input */}
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder={
                activeTab === 'colleges'
                  ? 'Search colleges by name or focus...'
                  : activeTab === 'exams'
                  ? 'Search exams by name or type...'
                  : 'Search scholarships by name or eligibility...'
              }
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search opportunities"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                aria-label="Clear search text"
              >
                ✕
              </button>
            )}
          </div>

          {/* Saved Only Filter Toggle */}
          <label className="saved-toggle-label">
            <input
              type="checkbox"
              className="saved-toggle-checkbox"
              checked={savedOnly}
              onChange={(e) => onToggleSavedOnly(e.target.checked)}
            />
            <span>★ Saved only</span>
          </label>
        </div>

        {/* 3. Dropdown Select Filters */}
        <div className="dropdowns-row">
          {/* Colleges Filters: Course, Location, Level */}
          {activeTab === 'colleges' && (
            <>
              <div className="filter-select-group">
                <label className="filter-label">Course</label>
                <select
                  className="filter-select"
                  value={filters.course}
                  onChange={(e) => onFilterChange('course', e.target.value)}
                >
                  <option value="ALL">All Courses</option>
                  {filterOptions.courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-select-group">
                <label className="filter-label">State / City</label>
                <select
                  className="filter-select"
                  value={filters.location}
                  onChange={(e) => onFilterChange('location', e.target.value)}
                >
                  <option value="ALL">All Locations</option>
                  {filterOptions.locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-select-group">
                <label className="filter-label">Level</label>
                <select
                  className="filter-select"
                  value={filters.level}
                  onChange={(e) => onFilterChange('level', e.target.value)}
                >
                  <option value="ALL">All Levels</option>
                  {filterOptions.levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Exams Filters: Level */}
          {activeTab === 'exams' && (
            <div className="filter-select-group">
              <label className="filter-label">Exam Level</label>
              <select
                className="filter-select"
                value={filters.level}
                onChange={(e) => onFilterChange('level', e.target.value)}
              >
                <option value="ALL">All Levels</option>
                {filterOptions.levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Scholarships Filters: Level */}
          {activeTab === 'scholarships' && (
            <div className="filter-select-group">
              <label className="filter-label">Scholarship Level</label>
              <select
                className="filter-select"
                value={filters.level}
                onChange={(e) => onFilterChange('level', e.target.value)}
              >
                <option value="ALL">All Levels</option>
                {filterOptions.levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Filters Button (active when any filter is set) */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-secondary btn-sm clear-filters-btn"
              onClick={onClearFilters}
            >
              ✕ Clear filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Live Result Count */}
      <div className="result-count-row">
        <span className="result-count-text">{resultCountText}</span>
        {savedOnly && (
          <span className="badge badge-normal" style={{ fontSize: '11px' }}>
            Filtering: Saved Items
          </span>
        )}
      </div>
    </div>
  );
}
