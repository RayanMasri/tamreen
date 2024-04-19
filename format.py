import json

with open('./data.json', 'r', encoding='utf8') as file:
    data = json.loads(file.read())


def filter_question(question):
    question["answers"] = list(filter(lambda e: e not in ['...', '..', '-'], question["answers"]))
    return question

for key, value in list(data.items()):
    print(len(value))
    removed=  []
    for i in range(len(value)):
        value[i] = filter_question(value[i])
        if "notes" in value[i]:
            del value[i]["notes"]
        if len(value[i]["answers"]) != 4:
            removed.append(i)

    value = list(filter(lambda e: e[0] not in removed, enumerate(value)))
    value = list(map(lambda e: e[1], value))
    print(len(value))
    data[key] = value



# skills = {
#     "verbal-analogy": [],
#     "contextual-error": [],
#     "sentence-completion": []
# }

# for item in data:
#     skill = item["skill"]
#     del item["skill"]
#     skills[skill] += [item]

# questions = []
# for model in data:
#     questions += model['questions']

# print(len(questions))
# questions = list(filter(lambda x: 'skill' in x and x["skill"] in ["verbal-analogy", "contextual-error", "sentence-completion"], questions))
# questions = list(filter(lambda x: x["status"] not in ["closed?", "unsure", "waiting", "inconsistent", "incomplete", "test-revision"], questions))

# for i in range(len(questions)):
#     del questions[i]["status"]
#     questions[i]["id"] = i

with open('./data.json', 'w', encoding='utf8') as file:
    file.write(json.dumps(data, ensure_ascii=False))
    # file.write(json.dumps(questions, ensure_ascii=False))

