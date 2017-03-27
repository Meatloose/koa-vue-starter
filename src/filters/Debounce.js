import debounce from 'utils/debounce'

export default (fn, delay) => debounce((event) => fn(event.target.value.trim()), delay)
