'use client'

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom-datepicker.css';

const Datepicker = () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());

    const handleDateChange = (date: Date | null) => {
    setStartDate(date);
};

return (
        <DatePicker
            selected={startDate}
            onChange={handleDateChange}
        />
    );
};

export default Datepicker;
