const getFaculties = (cb) => {
  setTimeout(() => cb(null, ['физический', 'исторический', 'философский']), 1000)
}
const getCourses = (faculty, cb) => {
  let courses;
  switch(faculty) {
    case 'физический': 
      courses = ['квантовая физика', 'термодинамика', 'космология']
      break
    case 'исторический':
      courses = ['история россии', 'история сша', 'история европы'] 
      break
    case 'философский':
      courses = ['философия древней греции', 'философия Шопенгауэра', 'философия Декарта']
      break
    default:
      courses = ['курсов нет']
  }
  setTimeout(() => cb(null, courses), 1000)
}
const savePerson = (person, cb) => {
  setTimeout(() => cb(null), 1000)
}
const client = {
  getFaculties,
  getCourses,
  savePerson
}

export default client