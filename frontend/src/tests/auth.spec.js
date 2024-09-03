import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from 'react-router-dom';

import App from '../App';


describe("Basics", () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });
})

describe("Login and Signup", () => {
  it('should allow someone to move between Login and Register', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(global.window.location.pathname).toContain('/login');
    // const registerButton = document.querySelector
    await userEvent.click(screen.getByText("No account? Register here"))
    expect(global.window.location.pathname).toContain('/register');
    await userEvent.click(screen.getByText("Already registered? Log in instead"))
    expect(global.window.location.pathname).toContain('/login');
  });

  it("Should allow someone to register a new account with valid details", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(global.window.location.pathname).toContain('/login');
    // const registerButton = document.querySelector
    await userEvent.click(screen.getByText("No account? Register here"))
    await userEvent.type(screen.getByPlaceholderText("Username"), "testUsername")
    await userEvent.type(screen.getByPlaceholderText("Email"), "testEmail@gmail.com")
    await userEvent.type(screen.getByPlaceholderText("Password"), "testPassword")
    // await userEvent.click(screen.getByText("Register to Coeus"))
    // await waitForElementToBeRemoved(screen.queryByText("Register to Coeus"))
    // screen.getByText("Home")

  })
})