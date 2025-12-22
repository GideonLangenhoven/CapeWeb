#!/bin/zsh

# 1. Update MiniQuiz (in Pillar files) to say "Knowledge Check"
# Targets normal module quizzes.
# Matches >Assessment</div> (common in MiniQuiz div badges)
sed -i '' 's/>Assessment<\/div>/>Knowledge Check<\/div>/g' src/components/CapeWebPillar*.js

# Matches >Assessment</CWBadge> (if MiniQuiz uses CWBadge)
sed -i '' 's/>Assessment<\/CWBadge>/>Knowledge Check<\/CWBadge>/g' src/components/CapeWebPillar*.js

# 2. Update QuizLayout (in Layouts file) to say "Final Assessment"
# Targets the big Final Quiz.
sed -i '' 's/>Assessment<\/CWBadge>/>Final Assessment<\/CWBadge>/' src/components/CapeWebLayouts.js

echo "Assessments renamed."
