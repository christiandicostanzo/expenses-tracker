import * as fc from 'fast-check';

// Valid categories for expenses
export const VALID_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];

// Arbitrary for generating valid category
export const categoryArbitrary = fc.constantFrom(...VALID_CATEGORIES);

// Arbitrary for generating valid positive amounts
export const positiveAmountArbitrary = fc.double({ min: 0.01, max: 999999.99, noNaN: true });

// Arbitrary for generating non-empty descriptions
export const nonEmptyDescriptionArbitrary = fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0);

// Arbitrary for generating valid ISO date strings
export const validDateArbitrary = fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31') })
  .map(date => date.toISOString().split('T')[0]);

// Arbitrary for generating valid expense objects (without ID)
export const validExpenseArbitrary = fc.record({
  amount: positiveAmountArbitrary,
  description: nonEmptyDescriptionArbitrary,
  category: categoryArbitrary,
  date: validDateArbitrary
});

// Arbitrary for generating complete expense objects (with ID)
export const completeExpenseArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }),
  amount: positiveAmountArbitrary,
  description: nonEmptyDescriptionArbitrary,
  category: categoryArbitrary,
  date: validDateArbitrary
});

// Arbitrary for generating invalid amounts (non-positive)
export const invalidAmountArbitrary = fc.oneof(
  fc.constant(0),
  fc.double({ max: -0.01, noNaN: true }),
  fc.constant(-0)
);

// Arbitrary for generating invalid descriptions (empty or whitespace)
export const invalidDescriptionArbitrary = fc.oneof(
  fc.constant(''),
  fc.constant('   '),
  fc.constant('\t'),
  fc.constant('\n'),
  fc.string({ maxLength: 10 }).filter(s => s.trim().length === 0)
);

// Arbitrary for generating invalid categories
export const invalidCategoryArbitrary = fc.oneof(
  fc.constant(null),
  fc.constant(undefined),
  fc.constant(''),
  fc.string().filter(s => !VALID_CATEGORIES.includes(s))
);

// Arbitrary for generating future dates
export const futureDateArbitrary = fc.date({ 
  min: new Date(Date.now() + 86400000), // Tomorrow
  max: new Date('2099-12-31') 
}).map(date => date.toISOString().split('T')[0]);

// Helper function to create a mock expense
export function createMockExpense(overrides = {}) {
  return {
    id: String(Date.now() + Math.random()),
    amount: 50.00,
    description: 'Test expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    ...overrides
  };
}

// Helper function to clear and reset DOM
export function resetDOM() {
  document.body.innerHTML = '';
}

// Helper function to create expense list container
export function createExpenseListContainer() {
  const container = document.createElement('ul');
  container.id = 'expense-list';
  document.body.appendChild(container);
  return container;
}

// Helper function to create total display element
export function createTotalDisplay() {
  const totalElement = document.createElement('span');
  totalElement.id = 'total-amount';
  document.body.appendChild(totalElement);
  return totalElement;
}
