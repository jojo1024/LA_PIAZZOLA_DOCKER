import { body, check } from "express-validator";

const getPaymentUrl = () => {
    return [
        check("userData").notEmpty().withMessage("champ obligatoire"),
        check("paymentData").notEmpty().withMessage("champ obligatoire")
    ]
}

export default {
    getPaymentUrl
}