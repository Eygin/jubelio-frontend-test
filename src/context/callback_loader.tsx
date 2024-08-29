import { Loader2 } from "lucide-react";

export default function CallbackLoader({ loading, loading_component = null, data, not_found_component = null, children }: { loading: boolean, loading_component?: React.ReactNode | null, data: Array<any> | object | null, children: React.ReactNode, not_found_component?: React.ReactNode | null }) {
    const isEmpty = (data: Array<any> | object | null): boolean => {
        if (data !== null) {
            if (Array.isArray(data)) {
                return data.length === 0;
            } else {
                return Object.keys(data).length === 0;
            }
        } else {
            return true;
        }
    }

    if (loading) {
        if (loading_component) {
            return <>{loading_component}</>;
        } else {
            return <div className="flex gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
            </div>
        }
    }

    if (isEmpty(data)) {
        if (not_found_component) {
            return <>{not_found_component}</>
        } else {
            return <div className="text-center">
                <h3 className="text-lg font-semibold text-muted-foreground">Data is empty.</h3>
            </div>
        }
    }


    return (
        <>
            {children}
        </>
    )
}