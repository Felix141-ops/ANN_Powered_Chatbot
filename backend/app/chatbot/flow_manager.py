from app.chatbot.form_definition import FORM_FIELDS

class FormFlowManager:
    def __init__(self):
        self.responses = {}

    def get_form(self):
        return FORM_FIELDS

    def submit_field(self, field_id, value):
        self.responses[field_id] = value

    def is_complete(self):
        return len(self.responses) == len(FORM_FIELDS)

    def get_payload(self):
        return self.responses
