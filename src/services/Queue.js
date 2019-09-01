import Bee from 'bee-queue';
import Subscription from '../app/jobs/Subscription';
import redisconfig from '../config/redis';

const jobs = [Subscription];

class Queue {
	constructor() {
		this.queues = {};

		this.init();
	}

	init() {
		jobs.forEach(({ key, handle }) => {
			this.queues[key] = {
				bee: new Bee(key, {
					redis: redisconfig,
				}),
				handle,
			};
		});
	}

	add(queue, job) {
		return this.queues[queue].bee.createJob(job).save();
	}

	processQueue() {
		jobs.forEach(job => {
			const { bee, handle } = this.queues[job.key];
			bee.on('failed', this.failure).process(handle);
		});
	}

	failure(job, err) {
		console.error(`Queue ${job.queue.name}: fail`, err);
	}
}

export default new Queue();
