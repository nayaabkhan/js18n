export function pluralise(match, count) {
  if (count == 0) {
    if (match.hasOwnProperty('zero')) return match.zero
    else return match.other
  } else if (count === 1) {
    return match.one
  }

  return match.other
}

export default {
  pluralise,
}
