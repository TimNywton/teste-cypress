///<reference types="cypress"/>

import {format} from '../support/utils' //importar formatação de variaveis pasta support

context('Testfinace', () => {    //contexto de teste
   
 beforeEach(() => {
   cy.visit('https://devfinance-agilizei.netlify.app/#')//visitar site
   cy.get('#data-table tbody tr').should('have.length', 0)//verificar o numero de linhas 

   });

   it('Cadastrar entradas', () => {   

   cy.get('#transaction .button').click() //Nova Transação
   cy.get('#description').type('Ganho') //Canpo Descrição
   cy.get('[name=amount]').type(50) //Campo Valor
   cy.get('[type=date]').type('2023-04-06') //Campo Data
   cy.get('button').contains('Salvar').click() //Salvar
   cy.get('#data-table tbody tr').should('have.length', 1)//numero de linhas 

   })
   
    it('Cadastrar saidas', () => {
      
      cy.get('#transaction .button').click() //Nova Transação
      cy.get('#description').type('Perda') //Canpo Descrição
      cy.get('[name=amount]').type(-30) //Campo Valor
      cy.get('[type=date]').type('2023-04-06') //Campo Data
      cy.get('button').contains('Salvar').click() //Salvar

      cy.get('#data-table tbody tr').should('have.length', 1)//numero de lnhas 
   
   });

   it('Remover entradas e saidas', () => {

      const entrada = 'Ganho' 
      const saida   = 'perda' 

      cy.get('#transaction .button').click() //Nova Transação
      cy.get('#description').type(entrada) //Canpo Descrição
      cy.get('[name=amount]').type(100) //Campo Valor
      cy.get('[type=date]').type('2023-04-06') //Campo Data
      cy.get('button').contains('Salvar').click() //Salvar

      cy.get('#transaction .button').click() //Nova Transação
      cy.get('#description').type(saida) //Canpo Descrição
      cy.get('[name=amount]').type(-50) //Campo Valor
      cy.get('[type=date]').type('2023-04-06') //Campo Data
      cy.get('button').contains('Salvar').click() //Salvar

      cy.contains(entrada) //contem na tela
         .parent()         //selecionar elemento pai
         .find('img[onclick*=remove]') //busca por curinga *
         .click()

      cy.get('td.description') //elemento que contem o texto
         .contains(saida)      //contem na tela
         .siblings()           //busca por irmaos 
         .children('img[onclick*=remove') //contem filhos
         .click()  
      

   });

   it('Veificar Valor Total', () => {

      const entrada = 'Ganho' 
      const saida   = 'perda' 

      cy.get('#transaction .button').click() //Nova Transação
      cy.get('#description').type(entrada) //Canpo Descrição
      cy.get('[name=amount]').type(100) //Campo Valor
      cy.get('[type=date]').type('2023-04-06') //Campo Data
      cy.get('button').contains('Salvar').click() //Salvar

      cy.get('#transaction .button').click() //Nova Transação
      cy.get('#description').type(saida) //Canpo Descrição
      cy.get('[name=amount]').type(-50) //Campo Valor
      cy.get('[type=date]').type('2023-04-06') //Campo Data
      cy.get('button').contains('Salvar').click() //Salvar
      
      let incomes = 0
      let expenses = 0

      cy.get('#data-table tbody tr')
      .each(($el, index, $list) => {
      cy.get($el).find('td.income, td.expense')
        .invoke('text').then(text => {
            if(text.includes('-')) {
               expenses = expenses + format(text)
            } 
            else {
               incomes = incomes + format(text)
            }
            cy.log ('entradas', incomes)
            cy.log ('saidas', expenses)

        })   
      })

      cy.get('#totalDisplay')
        .invoke('text')
        .then(text => {
         cy.log('valor total', format(text))
         
         let formattedTotalDisplay = format(text)
         let expectedTotal = incomes + expenses

         expect(formattedTotalDisplay).to.eq(expectedTotal)
         
        })
      
   });
});
