import React, { useEffect, useState } from "react";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import professionService from "../../../services/profession.service";
import qualityService from "../../../services/quality.service";
import userService from "../../../services/user.service";
import { useAuth } from "../../../hooks/useAuth";
import { getUserId } from "../../../services/localStorage.service";
import { useHistory, useParams } from "react-router-dom";

const EditUserPage = () => {
    const { userId } = useParams();
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        profession: "",
        sex: "male",
        qualities: [],
        completedMeetings: 0,
        image: "",
        _id: getUserId()
    });

    const [professinsHook, setProfessionsHook] = useState([]);
    const [qualitiesHook, setQualitiesHook] = useState([]);
    const [userQualities, setUserQualities] = useState([]);
    const professions = professinsHook.map((prof) => ({
        label: prof.name,
        value: prof._id
    }));
    console.log("Data ", data);

    const qualities = qualitiesHook.map((qual) => ({
        label: qual.name,
        value: qual._id,
        color: qual.color
    }));
    const { createUser } = useAuth();

    useEffect(() => {
        getProfessions();
        getQualitiesHook();
        getCurrentUser();
    }, []);

    useEffect(() => {
        setData((prevState) => ({
            ...prevState,
            completedMeetings: currentUser.completedMeetings,
            name: currentUser.name,
            email: currentUser.email,
            image: currentUser.image,
            profession: currentUser.profession,
            sex: currentUser.sex,
            qualities: currentUser.qualities
        }));
    }, [currentUser]);

    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        if (data.qualities) {
            modifyQualities(data.qualities).then((data) => {
                setUserQualities(data);
            });
        }
    }, [data]);

    useEffect(() => {
        if (userQualities.length > 0) {
            validate();
        }
    }, [userQualities]);

    async function getProfessions() {
        try {
            const { content } = await professionService.get();
            setProfessionsHook(content);
            setLoading(false);
        } catch (error) {}
    }

    async function getQualitiesHook() {
        try {
            const { content } = await qualityService.fetchAll();
            setQualitiesHook(content);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function modifyQualities(qualitiesArray) {
        if (qualitiesArray) {
            const modyfiedQualities = await qualitiesArray.map((qual) => {
                return qualities.find((q) => q.value === qual);
            });

            return modyfiedQualities;
        }
    }

    async function getCurrentUser() {
        try {
            const { content } = await userService.getCurrentUser();
            setCurrentUser(content);
        } catch (error) {}
    }

    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        try {
            await createUser({
                ...data,
                name: data.name,
                email: data.email,
                sex: data.sex,
                qualities: data.qualities
            });
        } catch (error) {}
        history.push(`/users/${userId}`);
    };

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Введите ваше имя"
            }
        }
    };

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const handleChangeQualities = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value.map((qual) => {
                return qual.value;
            })
        }));
    };

    function validate() {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }
    const isValid = Object.keys(errors).length === 0;
    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!isLoading && Object.keys(professions).length > 0 ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                options={professions}
                                name="profession"
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            {userQualities.length > 0 && (
                                <MultiSelectField
                                    defaultValue={userQualities}
                                    options={qualities}
                                    onChange={handleChangeQualities}
                                    name="qualities"
                                    label="Выберите ваши качества"
                                />
                            )}
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
