import Card from '@material-tailwind/react';
import CardRow from '@material-tailwind/react';
import CardHeader from '@material-tailwind/react';
import CardStatus from '@material-tailwind/react';
import CardStatusFooter from '@material-tailwind/react';
import Icon from '@material-tailwind/react';

export default function StatusCard({
    color,
    icon,
    title,
    amount,
    percentage,
    percentageColor,
    percentageIcon,
    date,
}) {
    return (
        <div className="px-4 mb-10">
            <Card>
                <CardRow>
                    <CardHeader color={color} iconOnly className="mb-0">
                        <Icon name={icon} size="3xl" color="white" />
                    </CardHeader>

                    <CardStatus title={title} amount={amount} />
                </CardRow>

                <CardStatusFooter
                    amount={percentage}
                    color={percentageColor}
                    date={date}
                >
                    <Icon color={percentageColor} name={percentageIcon} />
                </CardStatusFooter>
            </Card>
        </div>
    );
}
