import React from 'react';
import Quiz from '../../client/src/components/Quiz';

describe('Quiz Component', () => {
    beforeEach(() => {
        // Load the fixture data and stub the API call.
        cy.fixture('questions.json').then((fakeQuestions) => {
            cy.intercept('GET', '/api/questions/random', fakeQuestions).as('getQuestions');
        });

        // Mount the component before each test.
        cy.mount(<Quiz />);
    });

    it('renders the initial state with Start Quiz button', () => {
        // Initially the component should only show a "Start Quiz" button.
        cy.get('button').contains('Start Quiz');
        cy.get('h2').should('not.exist');
    });

    it('starts the quiz and displays the first question', () => {
        // Click "Start Quiz" to begin.
        cy.get('button').contains('Start Quiz').click();

        // Wait for the API call to resolve.
        cy.wait('@getQuestions');

        // After starting, the first question should be visible.
        cy.get('h2').should('contain', 'What is 2 + 2?');

        // Verify that each of the four answer texts is rendered.
        cy.contains('2').should('exist');
        cy.contains('4').should('exist');
        cy.contains('8').should('exist');
        cy.contains('16').should('exist');

        // Verify that there are 4 buttons labeled with 1-based indices.
        cy.get('button').contains('1').should('exist');
        cy.get('button').contains('2').should('exist');
        cy.get('button').contains('3').should('exist');
        cy.get('button').contains('4').should('exist');
    });

    it('increments the score and question index when the correct answer is clicked', () => {
        // Start the quiz.
        cy.get('button').contains('Start Quiz').click();
        cy.wait('@getQuestions');

        // For each of the 10 questions, click the 2nd answer (the correct answer).
        for (let i = 0; i < 10; i++) {
            cy.get('button').contains('2').click();
        }

        // After 10 questions, the quiz should be completed.
        cy.get('h2').should('contain', 'Quiz Completed');
        cy.contains('Your score: 10/10').should('exist');
    });

    it('restarts the quiz when Take New Quiz is clicked', () => {
        // Start and complete the quiz.
        cy.get('button').contains('Start Quiz').click();
        cy.wait('@getQuestions');
        for (let i = 0; i < 10; i++) {
            cy.get('button').contains('2').click();
        }

        // Click "Take New Quiz" to restart the quiz.
        cy.get('button').contains('Take New Quiz').click();

        // The quiz should restart: the question is shown again and the answer buttons reappear.
        cy.get('h2').should('contain', 'What is 2 + 2?');
        cy.get('button').contains('1').should('exist');
        cy.get('button').contains('2').should('exist');
        cy.get('button').contains('3').should('exist');
        cy.get('button').contains('4').should('exist');
    });
});