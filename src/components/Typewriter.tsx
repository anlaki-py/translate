import { useState, useEffect } from 'react'

interface TypewriterProps {
  text: string
}

export default function Typewriter({ text }: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    if (!text) return

    let i = 0
    const speed = text.length > 100 ? 5 : 15
    const chunk = text.length > 200 ? 2 : 1

    const interval = setInterval(() => {
      setDisplayed(() => {
        if (i >= text.length) {
          clearInterval(interval)
          return text
        }
        const next = text.slice(0, i + chunk)
        i += chunk
        return next
      })
    }, speed)

    return () => clearInterval(interval)
  }, [text])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="cursor-blink" />}
    </span>
  )
}
