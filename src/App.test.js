import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the echoSphere header', () => {
  render(<App />)
  const linkElement = screen.getByText(/echoSphere/i)
  expect(linkElement).toBeInTheDocument()
})
