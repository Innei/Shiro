import { Autocomplete } from '~/components/ui/auto-completion'

import { SidebarSection } from '../../writing/SidebarBase'
import { MOOD_SET, WEATHER_SET } from '../constants'
import { useNoteModelSingleFieldAtom } from '../data-provider'

export const NoteWeatherAndMood = () => {
  const [weather, setWeather] = useNoteModelSingleFieldAtom('weather')
  const [mood, setMood] = useNoteModelSingleFieldAtom('mood')

  return (
    <>
      <SidebarSection
        label="天气"
        className="flex items-center justify-between"
      >
        <Autocomplete
          wrapperClassName="flex-1"
          className="w-full"
          defaultValue={weather}
          suggestions={WEATHER_SET.map((w) => ({ name: w, value: w }))}
          onSuggestionSelected={(suggestion) => {
            setWeather(suggestion.value)
          }}
          placeholder=" "
          onChange={(e) => {
            setWeather(e.target.value)
          }}
          onConfirm={(value) => {
            setWeather(value)
          }}
        />
      </SidebarSection>

      <SidebarSection
        label="心情"
        className="flex items-center justify-between"
      >
        <Autocomplete
          placeholder=" "
          wrapperClassName="flex-1"
          className="w-full"
          label=""
          defaultValue={mood}
          suggestions={MOOD_SET.map((w) => ({ name: w, value: w }))}
          onSuggestionSelected={(suggestion) => {
            setMood(suggestion.value)
          }}
          onChange={(e) => {
            setMood(e.target.value)
          }}
          onConfirm={(value) => {
            setMood(value)
          }}
        />
      </SidebarSection>
    </>
  )
}
