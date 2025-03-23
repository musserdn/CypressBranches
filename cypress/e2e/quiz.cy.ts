describe('Quiz End-to-End Test', () => {
  // Helper function: recursively answer questions until quiz is complete.
  function answerQuiz(): Cypress.Chainable<any> {
    return cy.get('body').then($body => {
      // If the page already shows "Quiz Completed", then stop recursion.
      if ($body.text().includes('Quiz Completed')) {
        return;
      } else {
        // Within the quiz card, locate buttons whose trimmed text is a number.
        return cy.get('div.card').within(() => {
          cy.get('button').then($btns => {
            // Filter only those answer buttons based on numeric text.
            const answerBtns = Cypress._.filter($btns, (btn) => {
              const text = btn.innerText.trim();
              const num = parseInt(text, 10);
              return !isNaN(num);
            });
            if (answerBtns.length) {
              // Randomly choose one of the answer buttons.
              const randomIndex = Cypress._.random(0, answerBtns.length - 1);
              cy.wrap(answerBtns[randomIndex]).click();
            }
          });
        })
        .then(() => {
          // Wait for an update, then call answerQuiz recursively.
          cy.wait(100);
          answerQuiz();
        });
      }
    });
  }

  it('completes the quiz twice with random answers', () => {
    // Visit the page.
    cy.visit('/');
    
    // Start the quiz by clicking the "Start Quiz" button.
    cy.contains('Start Quiz').click();
    
    // Answer questions until the quiz is completed the first time.
    answerQuiz().then(() => {
      // Verify that the quiz reached the completed state.
      cy.contains('Quiz Completed').should('exist');
      cy.contains('Your score').should('exist');

      // Click "Take New Quiz" to restart the quiz.
      cy.contains('Take New Quiz').click();
      
      // Answer the quiz again until complete.
      answerQuiz().then(() => {
        cy.contains('Quiz Completed').should('exist');
      });
    });
  });

  it('returns valid quiz data from API', () => {
    // Make a direct API call to verify the API response.
    cy.request('GET', 'http://localhost:3001/api/questions/random').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      response.body.forEach((question: any) => {
        expect(question).to.have.property('question');
        expect(question.question).to.be.a('string');
        expect(question).to.have.property('answers');
        expect(question.answers).to.be.an('array');
        question.answers.forEach((answer: any) => {
          expect(answer).to.have.property('text');
          expect(answer.text).to.be.a('string');
          expect(answer).to.have.property('isCorrect');
          expect(answer.isCorrect).to.be.a('boolean');
        });
      });
    });
  });
});
