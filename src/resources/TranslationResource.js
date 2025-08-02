function TranslationResource(data) {
    return {
        id: parseInt(data.id, 10),
        locale: String(data.locale),
        ...(data.title && { title: String(data.title) }),
        ...(data.short_desc && { short_desc: String(data.short_desc) }),
        ...(data.description && { description: String(data.description) }),
        ...(data.button_text && { button_text: String(data.button_text) }),
        ...(data.address && { address: String(data.address) }),
        ...(data.question && { question: String(data.question) }),
        ...(data.answer && { answer: String(data.answer) }),
        ...(data.faq && { faq: String(data.faq) }),
    };
}

module.exports = TranslationResource;
