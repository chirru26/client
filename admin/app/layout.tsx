import '../src/index.css'
import '../src/App.css'

export const metadata = {
  title: 'Chirru Admin',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
