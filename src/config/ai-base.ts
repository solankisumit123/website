// AI Base configuration for the movie application
export const AI_BASE_CONFIG = {
  // AI Features
  FEATURES: {
    AUTO_CATEGORIZATION: true,
    SMART_SEARCH: true,
    RECOMMENDATION_ENGINE: true,
    CONTENT_ANALYSIS: true,
    DUPLICATE_DETECTION: true,
  },

  // AI Models and Services
  MODELS: {
    CATEGORY_CLASSIFIER: 'movie-category-classifier',
    CONTENT_ANALYZER: 'content-analyzer',
    RECOMMENDATION_ENGINE: 'collaborative-filtering',
    SEARCH_ENGINE: 'semantic-search',
  },

  // AI Processing Rules
  PROCESSING: {
    AUTO_TAG_GENERATION: true,
    SIMILARITY_THRESHOLD: 0.85,
    MAX_RECOMMENDATIONS: 10,
    SEARCH_RESULT_LIMIT: 20,
  },

  // Content Analysis
  CONTENT_ANALYSIS: {
    DETECT_DUPLICATES: true,
    EXTRACT_METADATA: true,
    VALIDATE_LINKS: true,
    ANALYZE_QUALITY: true,
  },
};

// AI Helper Functions
export class AIBase {
  // Auto-categorize movie based on title and description
  static categorizeMovie(title: string, synopsis?: string): string {
    const titleLower = title.toLowerCase();
    const synopsisLower = synopsis?.toLowerCase() || '';
    const combinedText = `${titleLower} ${synopsisLower}`;

    // Category detection logic
    if (combinedText.includes('action') || combinedText.includes('fight') || combinedText.includes('explosion')) {
      return 'Action';
    }
    if (combinedText.includes('comedy') || combinedText.includes('funny') || combinedText.includes('humor')) {
      return 'Comedy';
    }
    if (combinedText.includes('horror') || combinedText.includes('scary') || combinedText.includes('thriller')) {
      return 'Horror';
    }
    if (combinedText.includes('romance') || combinedText.includes('love') || combinedText.includes('romantic')) {
      return 'Romance';
    }
    if (combinedText.includes('sci-fi') || combinedText.includes('space') || combinedText.includes('future')) {
      return 'Sci-Fi';
    }
    if (combinedText.includes('imax') || combinedText.includes('4k') || combinedText.includes('2160p')) {
      return 'IMAX';
    }
    if (combinedText.includes('dual audio') || combinedText.includes('hindi')) {
      return 'Dual Audio Movies';
    }

    return 'Drama'; // Default category
  }

  // Smart search with semantic understanding
  static smartSearch(query: string, movies: any[]): any[] {
    const queryLower = query.toLowerCase();
    const results = movies.filter(movie => {
      const titleMatch = movie.title.toLowerCase().includes(queryLower);
      const categoryMatch = movie.category?.toLowerCase().includes(queryLower);
      const yearMatch = movie.year?.toString().includes(queryLower);
      const qualityMatch = movie.downloadLinks?.some((link: any) => 
        link.quality.toLowerCase().includes(queryLower)
      );
      
      return titleMatch || categoryMatch || yearMatch || qualityMatch;
    });

    // Sort by relevance
    return results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(queryLower);
      const bTitleMatch = b.title.toLowerCase().includes(queryLower);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });
  }

  // Generate movie recommendations
  static generateRecommendations(movie: any, allMovies: any[]): any[] {
    const recommendations = allMovies.filter(m => 
      m._id !== movie._id && (
        m.category === movie.category ||
        m.downloadLinks?.some((link: any) => 
          movie.downloadLinks?.some((mlink: any) => mlink.quality === link.quality)
        )
      )
    );

    return recommendations.slice(0, AI_BASE_CONFIG.PROCESSING.MAX_RECOMMENDATIONS);
  }

  // Validate download links
  static validateDownloadLinks(links: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    links.forEach((link, index) => {
      if (!link.url) {
        errors.push(`Link ${index + 1}: Missing URL`);
      }
      if (!link.size) {
        errors.push(`Link ${index + 1}: Missing file size`);
      }
      if (!link.audio) {
        errors.push(`Link ${index + 1}: Missing audio information`);
      }
      if (!link.format) {
        errors.push(`Link ${index + 1}: Missing format`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Auto-generate movie tags
  static generateTags(movie: any): string[] {
    const tags: string[] = [];
    
    // Add quality tags
    movie.downloadLinks?.forEach((link: any) => {
      tags.push(link.quality);
      tags.push(link.format);
      if (link.audio.includes('Dual')) {
        tags.push('Dual Audio');
      }
    });

    // Add category tag
    tags.push(movie.category);

    // Add year tag
    tags.push(movie.year.toString());

    // Add quality indicator
    if (movie.downloadLinks?.some((link: any) => link.quality === '4k' || link.quality === '2160p')) {
      tags.push('4K');
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  // Detect duplicate movies
  static detectDuplicates(newMovie: any, existingMovies: any[]): any[] {
    const titleLower = newMovie.title.toLowerCase();
    const year = newMovie.year;
    
    return existingMovies.filter(movie => 
      movie.title.toLowerCase() === titleLower && movie.year === year
    );
  }

  // Analyze movie quality score
  static analyzeQuality(movie: any): number {
    let score = 0;
    
    // Base score from rating
    score += (movie.rating || 0) * 10;
    
    // Quality bonus
    if (movie.downloadLinks?.some((link: any) => link.quality === '4k' || link.quality === '2160p')) {
      score += 20;
    }
    if (movie.downloadLinks?.some((link: any) => link.quality === '1080p')) {
      score += 15;
    }
    
    // Multiple download options bonus
    if (movie.downloadLinks?.length > 1) {
      score += 10;
    }
    
    // Recent year bonus
    const currentYear = new Date().getFullYear();
    if (movie.year >= currentYear - 2) {
      score += 10;
    }
    
    return Math.min(score, 100); // Cap at 100
  }
}

// AI-powered form validation
export const AIFormValidator = {
  validateMovieForm: (formData: any) => {
    const errors: string[] = [];
    
    // Basic validation
    if (!formData.title?.trim()) {
      errors.push('Title is required');
    }
    if (!formData.releaseYear || formData.releaseYear < 1888 || formData.releaseYear > new Date().getFullYear() + 1) {
      errors.push('Invalid release year');
    }
    if (!formData.category) {
      errors.push('Category is required');
    }
    if (!formData.posterUrl?.trim()) {
      errors.push('Poster URL is required');
    }
    if (!formData.backdropUrl?.trim()) {
      errors.push('Backdrop URL is required');
    }
    if (!formData.rating || formData.rating < 0 || formData.rating > 10) {
      errors.push('Rating must be between 0 and 10');
    }
    if (!formData.trailerUrl?.trim()) {
      errors.push('Trailer URL is required');
    }

    // Download links validation
    const validLinks = formData.downloadLinks?.filter((link: any) => 
      link.url && link.size && link.audio && link.format
    ) || [];
    
    if (validLinks.length === 0) {
      errors.push('At least one complete download link is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}; 