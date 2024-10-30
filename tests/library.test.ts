import { expect } from 'chai';
import { Library } from '../src/Library';

describe('Library', () => {
  it('should add an item', () => {
    const library = new Library();
    library.addItem({ title: 'Test Book' });
    expect(library.getItems().length).to.equal(1);
  });
});
