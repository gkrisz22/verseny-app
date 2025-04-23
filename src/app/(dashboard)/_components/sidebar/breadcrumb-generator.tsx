interface Breadcrumb {
    label: string;
    href: string;
}

const generateBreadcrumbs = (pathname: string): Breadcrumb[] => {

    const pathSegments = pathname.split('/').filter((segment) => segment !== '');
    const breadcrumbs: Breadcrumb[] = [];
    let currentPath = '';
    const basePath = '/';
    const basePathSegments = basePath.split('/').filter((segment) => segment !== '');
    const allSegments = [...basePathSegments, ...pathSegments];
    allSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({
            label: label,
            href: currentPath,
        });
    }
    );
    return breadcrumbs;
};

export { generateBreadcrumbs };
