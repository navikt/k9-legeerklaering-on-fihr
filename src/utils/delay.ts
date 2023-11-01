import debounce from "@/utils/debounce";

// This is used in fake api implementations during test/dev, to simulate waiting for a real api response.
const delay = (millis: number) => debounce(millis, (new AbortController).signal)

export default delay;