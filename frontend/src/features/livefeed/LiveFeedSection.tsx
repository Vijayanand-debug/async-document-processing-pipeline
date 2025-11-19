import { useAppStore } from '@/store/store';
import { menuItems } from '@/utils/utils';

const Icon = {
    Liveupdates: menuItems.live_feed,
    Uploading: menuItems.uploading,
    SQS: menuItems.sqs,
    Processing: menuItems.processing,
    GenAI: menuItems.genai,
    ProcessComplete: menuItems.processComplete,
    FailedStep: menuItems.failedStepIcon,
    Redis: menuItems.redis
};

const steps = [
    {
        id: 1,
        title: "Uploading",
        description: "Sending Document/Text to the pipeline",
        icon: <Icon.Uploading size={28} />,
    },
    {
        id: 2,
        title: "Push Data to SQS",
        description: "Message queued for workers",
        icon: <Icon.SQS size={28} />,
    },
    {
        id: 3,
        title: "Publish Updates to Redis",
        description: "Websocket updates for Client",
        icon: <Icon.Redis size={28} />,
    },
    {
        id: 4,
        title: "Extracting Data",
        description: "Extracting Text from Doc/ Reading Input Text",
        icon: <Icon.Processing size={28} />,
    },
    {
        id: 5,
        title: "Generative AI Processing",
        description: "AI processes your Doc/Text in real time",
        icon: <Icon.GenAI size={28} />,
    },
    {
        id: 6,
        title: "Completed",
        description: "Pipeline Successful",
        icon: <Icon.ProcessComplete size={28} />,
    }
];

export default function LiveFeedSection() {

    const highlight = useAppStore((state) => state.highlight);
    const currentStep = useAppStore((state) => state.currentStep);
    const failedStep = useAppStore((state) => state.failedStep);

    return (
        <>
            <section id="live-feed-section" className={`card glass p-6 rounded-2xl shadow-md transition-all duration-700 ${highlight
                ? 'ring-4 ring-cyan-400/70 shadow-cyan-200/50 scale-[1.01]'
                : 'ring-0'
                }`}>
                <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-4 flex items-center gap-2">
                    <Icon.Liveupdates className="text-emerald-600" /> Live Updates
                </h2>

                <div className="pt-[5px] px-[5px]">
                    <ol className="relative text-gray-700">
                        <div className="absolute left-6 top-0 bottom-5 w-px bg-emerald-200" />

                        {steps.map((step, index) => {
                            const isActive = index < currentStep;
                            const isStepFailed = failedStep === index;


                            let iconClasses = "absolute left-6 -translate-x-1/2 top-0 flex items-center justify-center w-[40px] h-[40px] rounded-full ring-4 ring-white shadow-md transition-all duration-300 ";
                            let titleClasses = "font-medium ml-[5.25rem] transition-colors ";
                            let descriptionClasses = "text-sm ml-[5.25rem] mt-1 transition-colors ";

                            if (isStepFailed) {
                                iconClasses += "bg-red-500 text-white";
                                titleClasses += "text-red-600";
                                descriptionClasses += "text-red-400";
                            } else if (isActive) {
                                iconClasses += "bg-gradient-to-r from-emerald-600 to-teal-500 text-white";
                                titleClasses += "text-gray-900";
                                descriptionClasses += "text-gray-500";
                            } else {
                                iconClasses += "bg-gray-200 text-gray-400";
                                titleClasses += "text-gray-400";
                                descriptionClasses += "text-gray-400";
                            }

                            return (
                                <li key={step.id} className="mb-[40px] relative">
                                    <span className={iconClasses} > {!isStepFailed ? step.icon : <Icon.FailedStep size={28} />} </span>
                                    <h3 className={titleClasses} > {step.title} </h3>
                                    <p className={descriptionClasses} > {step.description} </p>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </section>
        </>
    );
}