import React from 'react';
import Quiz from '../../client/src/components/Quiz';

describe('Quiz Component', () => {
    it('renders the initial state with Start Quiz button', () => {
        cy.mount(<Quiz />);
        cy.get('button').contains('Start Quiz');
    });

    it('starts the quiz and displays a question with answer buttons', () => {
        cy.mount(<Quiz />);
        cy.get('button').contains('Start Quiz').click();

        // The fake question should be displayed once the quiz starts.
        cy.get('h2').should('contain', 'What is 2 + 2?');

        // Check that the answer buttons are rendered (using the 1-based index label).
        cy.get('button').contains('1').should('exist');
        cy.get('button').contains('2').should('exist');
    });
});