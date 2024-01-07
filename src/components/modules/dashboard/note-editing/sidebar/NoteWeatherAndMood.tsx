import { Autocomplete } from '~/components/ui/auto-completion'

import { MOOD_SET, WEATHER_SET } from '../constants'
import { useNoteModelSingleFieldAtom } from '../data-provider'

export const NoteWeatherAndMood = () => {
  const [weather, setWeather] = useNoteModelSingleFieldAtom('weather')
  const [mood, setMood] = useNoteModelSingleFieldAtom('mood')

  return (
    <>
      <div className="flex items-center justify-between">
        <p>天气</p>
        <Autocomplete
          wrapperClassName="flex-1 ml-3"
          className="w-full"
          defaultValue={weather}
          suggestions={WEATHER_SET.map((w) => ({ name: w, value: w }))}
          onSuggestionSelected={(suggestion) => {
            setWeather(suggestion.value)
          }}
          placeholder=" "
          onConfirm={(value) => {
            setWeather(value)
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p>心情</p>
        <Autocomplete
          placeholder=" "
          wrapperClassName="flex-1 ml-3"
          className="w-full"
          label=""
          defaultValue={mood}
          suggestions={MOOD_SET.map((w) => ({ name: w, value: w }))}
          onSuggestionSelected={(suggestion) => {
            setMood(suggestion.value)
          }}
          onConfirm={(value) => {
            setMood(value)
          }}
        />
      </div>
    </>
  )
}
