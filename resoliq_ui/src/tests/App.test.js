import { render, screen } from "@testing-library/react";
import App from "../App";

test("renderiza login por defecto", () => {
  render(<App />);
  expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
});
