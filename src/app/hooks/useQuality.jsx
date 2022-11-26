import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import qualityService from "../services/quality.service";
import { toast } from "react-toastify";

const QualityContext = React.createContext();

export const useQuality = () => {
    return useContext(QualityContext);
};

export const QualityProvider = ({ children }) => {
    const [isLoading, setLoading] = useState(true);
    const [qualities, setQualities] = useState([]);
    const [error, setError] = useState(null);
    // console.log(qualities);
    useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);
    useEffect(() => {
        getQualityList();
    }, []);
    function errorCatcher(error) {
        const { message } = error.response.data;
        setError(message);
    }
    function getQualities(arrId) {
        const qualitiesArray = [];
        qualities.forEach((item) => {
            arrId.forEach((id) => {
                if (item._id === id) {
                    qualitiesArray.push(item);
                }
            });
        });
        return qualitiesArray;
    }
    async function getQualityList() {
        try {
            const { content } = await qualityService.get();
            setQualities(content);
            setLoading(false);
        } catch (error) {
            errorCatcher(error);
        }
    }
    return (
        <QualityContext.Provider value={{ isLoading, qualities, getQualities }}>
            {children}
        </QualityContext.Provider>
    );
};

QualityProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
