import './loader.css';

export function AppLoader() {
	return (
		<div className="bh-loader-container">
			<div className="bh-brand-stack">
				<img
					src="/logo-removebg.png"
					alt="Ashirwad Engicon Group Logo"
					className="bh-logo"
				/>

				<div className="bh-text-stack">
					<div className="bh-title">ASHIRWAD</div>
					<div className="bh-subtitle">ENGICON GROUP</div>

					<div className="bh-system-status">
						<div className="bh-progress-track">
							<div className="bh-progress-indicator" />
						</div>
					</div>

					<div className="bh-iso">
						An ISO 9001:2008 Certified Company
					</div>
				</div>
			</div>
		</div>
	);
}