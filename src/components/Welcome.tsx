import { PansyMark } from "./PansyMark"

export default function Welcome({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="welcome">
      <PansyMark />
      <h1>Welcome</h1>
      <p className="lede">
        Ophelia's Pansies is a quiet place to check in with your thoughts and feelings.
      </p>
      <p className="lede">
        Pansies, that's for thoughts. Note the morning, note the evening, and see what today resembles.
      </p>
      <p className="lede">Your notes stay in this browser. Nothing is sent away.</p>
      <div className="actions">
        <button type="button" className="btn btn-primary" onClick={onBegin}>
          Begin today's check-in
        </button>
      </div>
    </div>
  )
}
