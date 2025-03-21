/**
 * CategorySelector Component
 * Renders category filter tiles for scenarios
 */
export default {
    name: 'CategorySelector',

    props: {
        categories: {
            type: Array,
            required: true
        },
        selectedCategory: {
            type: String,
            default: 'All'
        }
    },

    template: `
      <div class="category-selector">
        <div 
          v-for="category in categories" 
          :key="category" 
          class="category-tile"
          :class="{ selected: selectedCategory === category }" 
          @click="selectCategory(category)"
        >
          {{ category }}
        </div>
      </div>
    `,

    methods: {
        selectCategory(category) {
            this.$emit('category-selected', category);
        }
    }
};