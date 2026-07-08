import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove translation lines containing "wizard" or "insightsSummary"
lines = content.split('\n')
new_lines = []
for line in lines:
    if 'budgetWizard:' in line or 'wizardStep1:' in line or 'wizardStep2:' in line or 'wizardStep3:' in line or 'wizardStep4:' in line or 'wizardIncomeLabel:' in line or 'wizardFrameworkLabel:' in line or 'wizardAssignLabel:' in line or 'wizardApply:' in line or 'insightsSummary:' in line:
        continue
    new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.write('\n'.join(new_lines))
