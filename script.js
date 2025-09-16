// // The provided course information.
// const CourseInfo = {
//   id: 451,
//   name: "Introduction to JavaScript"
// };

// // The provided assignment group.
// const AssignmentGroup = {
//   id: 12345,
//   name: "Fundamentals of JavaScript",
//   course_id: 451,
//   group_weight: 25,
//   assignments: [
//     {
//       id: 1,
//       name: "Declare a Variable",
//       due_at: "2023-01-25",
//       points_possible: 50
//     },
//     {
//       id: 2,
//       name: "Write a Function",
//       due_at: "2023-02-27",
//       points_possible: 150
//     },
//     {
//       id: 3,
//       name: "Code the World",
//       due_at: "3156-11-15",
//       points_possible: 500
//     }
//   ]
// };

// // The provided learner submission data.
// const LearnerSubmissions = [
//   {
//     learner_id: 125,
//     assignment_id: 1,
//     submission: {
//       submitted_at: "2023-01-25",
//       score: 47
//     }
//   },
//   {
//     learner_id: 125,
//     assignment_id: 2,
//     submission: {
//       submitted_at: "2023-02-12",
//       score: 150
//     }
//   },
//   {
//     learner_id: 125,
//     assignment_id: 3,
//     submission: {
//       submitted_at: "2023-01-25",
//       score: 400
//     }
//   },
//   {
//     learner_id: 132,
//     assignment_id: 1,
//     submission: {
//       submitted_at: "2023-01-24",
//       score: 39
//     }
//   },
//   {
//     learner_id: 132,
//     assignment_id: 2,
//     submission: {
//       submitted_at: "2023-03-07",
//       score: 140
//     }
//   }
// ];

// function getLearnerData(course, ag, submissions) {
//   // here, we would process this data to achieve the desired result.
//   const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0 // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833 // late: (140 - 15) / 150
//     }
//   ];

//   return result;
// }

// const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

// console.log(result);
/* result Array [
     {





     }   

]; */


function getLearnerData(course, assignmentGroup, submissions) {
  if (!course || !assignmentGroup || !submissions) return [];
  if (assignmentGroup.course_id !== course.id) return [];

  const now = new Date();
  const assignById = {};
  for (let i = 0; i < assignmentGroup.assignments.length; i++) {
    const a = assignmentGroup.assignments[i];
    assignById[a.id] = a;
    a.points = a.points_possible || 0;
    a.due = a.due_at ? new Date(a.due_at) : now;
  }
  
  
  const learners = {};

  for (let i = 0; i < submissions.length; i++) {
    const record = submissions[i];
    const learnerId = record.learner_id;
    const assignmentId = record.assignment_id;
    const submission = record.submission;
    const score = submission.score;
    if (!assignById[assignmentId]) continue;
    
    const a = assignById[assignmentId];
    const dueDate = a.due;
    if (dueDate > now) continue; // not due yet

    if (!learners[learnerId]) {
      learners[learnerId] = { id: learnerId, totalEarned: 0, totalPossible: 0 };
    }
    
    const normalized = score / a.points;
    learners[learnerId][assignmentId] = round3(normalized);
    learners[learnerId].totalEarned += score;
    learners[learnerId].totalPossible += a.points;
  }

  const result = Object.values(learners).map(l => {
    const avg = l.totalPossible > 0 ? round3(l.totalEarned / l.totalPossible) : 0;
    const { id, totalEarned, totalPossible, ...perAssignment } = l;
    return { id, avg, ...perAssignment };
  });

  
  result.sort((a, b) => a.id - b.id);

  return result;
}


const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);