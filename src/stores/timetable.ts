import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Timetable, Subject, Class } from '@/types'

export const useTimetableStore = defineStore('timetable', () => {
  const timetables = ref<Timetable[]>([])
  const subjects = ref<Subject[]>([])
  const classes = ref<Class[]>([])

  function addSubject(subject: Omit<Subject, 'id'>) {
    subjects.value.push({ ...subject, id: Date.now() })
    saveToLocalStorage()
  }

  function updateSubject(id: number, subject: Partial<Subject>) {
    const index = subjects.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subjects.value[index] = { ...subjects.value[index], ...subject } as Subject
      saveToLocalStorage()
    }
  }

  function deleteSubject(id: number) {
    subjects.value = subjects.value.filter(s => s.id !== id)
    saveToLocalStorage()
  }

  function addClass(classData: Omit<Class, 'id'>) {
    classes.value.push({ ...classData, id: Date.now() })
    saveToLocalStorage()
  }

  function updateClass(id: number, classData: Partial<Class>) {
    const index = classes.value.findIndex(c => c.id === id)
    if (index !== -1) {
      classes.value[index] = { ...classes.value[index], ...classData } as Class
      saveToLocalStorage()
    }
  }

  function addTimetable(timetable: Omit<Timetable, 'id'>) {
    const existing = timetables.value.findIndex(
      t => t.class === timetable.class &&
           t.section === timetable.section &&
           t.day === timetable.day
    )

    if (existing !== -1) {
      timetables.value[existing] = { ...timetable, id: timetables.value[existing].id }
    } else {
      timetables.value.push({ ...timetable, id: Date.now() })
    }
    saveToLocalStorage()
  }

  function getTimetableByClass(className: string, section: string) {
    return timetables.value.filter(
      t => t.class === className && t.section === section
    )
  }

  function getTimetableByTeacher(teacherId: number) {
    return timetables.value.filter(t =>
      t.periods.some(p => p.teacher === teacherId)
    )
  }

  function checkClash(teacherId: number, day: string, startTime: string, endTime: string) {
    const teacherTimetables = getTimetableByTeacher(teacherId)

    for (const timetable of teacherTimetables) {
      if (timetable.day !== day) continue

      for (const period of timetable.periods) {
        if (period.teacher !== teacherId) continue

        if (
          (startTime >= period.startTime && startTime < period.endTime) ||
          (endTime > period.startTime && endTime <= period.endTime) ||
          (startTime <= period.startTime && endTime >= period.endTime)
        ) {
          return true
        }
      }
    }
    return false
  }

  function saveToLocalStorage() {
    localStorage.setItem('timetables', JSON.stringify(timetables.value))
    localStorage.setItem('subjects', JSON.stringify(subjects.value))
    localStorage.setItem('classes', JSON.stringify(classes.value))
  }

  function loadFromLocalStorage() {
    const savedTimetables = localStorage.getItem('timetables')
    const savedSubjects = localStorage.getItem('subjects')
    const savedClasses = localStorage.getItem('classes')
    if (savedTimetables) timetables.value = JSON.parse(savedTimetables)
    if (savedSubjects) subjects.value = JSON.parse(savedSubjects)
    if (savedClasses) classes.value = JSON.parse(savedClasses)
  }

  return {
    timetables,
    subjects,
    classes,
    addSubject,
    updateSubject,
    deleteSubject,
    addClass,
    updateClass,
    addTimetable,
    getTimetableByClass,
    getTimetableByTeacher,
    checkClash,
    loadFromLocalStorage
  }
})
