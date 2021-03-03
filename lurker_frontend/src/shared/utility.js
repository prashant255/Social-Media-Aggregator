export const checkValidity = (value, rules) => {
    let isValid = true;
    let errorMessage = null;
    let localValidity = false;

    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        localValidity = value.trim() !== ''
        isValid = localValidity && isValid;
        errorMessage = !localValidity ? 'This field cannot be empty!' : errorMessage
    }

    if (rules.minLength) {
        localValidity = value.length >= rules.minLength
        isValid = localValidity && isValid
        errorMessage = !localValidity ? 'Minimum ' + rules.minLength + ' characters is required!' : errorMessage
    }

    if (rules.maxLength) {
        localValidity = value.length <= rules.maxLength 
        isValid = localValidity && isValid
        errorMessage = !localValidity ? 'Maximum length of ' + rules.maxLength + ' charcaters is allowed!': errorMessage
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        localValidity = pattern.test(value)
        isValid = localValidity && isValid
        errorMessage = !localValidity ? 'Incorrect email format!' : errorMessage
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        localValidity = pattern.test(value) 
        isValid =  localValidity && isValid
        errorMessage = localValidity ? 'Numeric data is only allowed!' : errorMessage
    }

    return {isValid, errorMessage};
}