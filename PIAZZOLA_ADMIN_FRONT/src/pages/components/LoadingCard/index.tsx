import LoadingIcon from '../LoadingIcon';

export interface ILoadingCardProf {
    libelle?: string;
    hauteur?: any;
}

function LoadingCard(props: ILoadingCardProf) {
    const { libelle = "Chargement des données en cours", hauteur } = props
    return (
        <div className={`box mt-8 h-96  flex items-center intro-y justify-center`}>
            <div className="flex flex-col items-center justify-end col-span-6 sm:col-span-3 xl:col-span-2">
                <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                <div className="mt-2 text-xs text-center">{libelle}</div>
            </div>
        </div>
    )
}

export default LoadingCard