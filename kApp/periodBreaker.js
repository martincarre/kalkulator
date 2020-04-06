var periodBreak = function() {
    switch (payload.leasingDetails.period) {
        case 'm':
            i = i / 12;
            t = n;
            break;
        case 'q':
            i = i / 4;
            t = n / 3;
            break;
        case 's': 
            i = i / 2;
            t = n / 6;
            break;
        case 'a':
            t = n / 12;
            break;
        default: 
            i = i / 12;
            t = n;
            break;
    }

    return {
        rate: i,
        period: t
    }
}